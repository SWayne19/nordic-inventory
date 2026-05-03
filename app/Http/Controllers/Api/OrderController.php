<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Order;

class OrderController extends Controller
{
    // get paginated orders for auth user
    public function index()
    {
        $orders = Order::with('items.product')
                ->where('user_id', auth()->id())
                ->latest()
                ->paginate(2);

        return response()->json($orders);
    }

    // store new orders
    public function store(Request $request)
    {
        // validation
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // database transaction for safe store
        return DB::transaction(function () use ($request) {
            $totalPrice = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                // prevent race condition
                $product = Product::lockForUpdate()->find($item['product_id']);

                // stock check
                if ($product->stock < $item['quantity']) {
                    return response()->json([
                        'message' => "Product {$product->name} is out of stock."
                    ], 400);
                }

                // calculate total price
                $itemTotal = $product->price * $item['quantity'];
                $totalPrice += $itemTotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ];

                // reduce balance
                $product->decrement('stock', $item['quantity']);
            }

            // create order
            $order = Order::create([
                'user_id' => auth()->id(),
                'total_price' => $totalPrice,
            ]);

            // save orderitems
            foreach ($orderItemsData as $data) {
                $order->items()->create($data);
            }

            return response()->json([
                'message' => 'Order placed successfully!',
                'order_id' => $order->id,
                'total_price' => $totalPrice
            ], 201);
        });
    }
}
