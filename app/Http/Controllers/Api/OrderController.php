<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items.product')
                ->where('user_id', auth()->id())
                ->latest()
                ->paginate(10);

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $totalPrice = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                //prevent race condition
                $product = Product::lockForUpdate()->find($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    return response()->json([
                        'message' => "Product {$product->name} is out of stock."
                    ], 400);
                }

                // total price calculation
                $itemTotal = $product->price * $item['quantity'];
                $totalPrice += $itemTotal;

                // add into orderitem array
                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ];

                // balance update
                $product->decrement('stock', $item['quantity']);

                // store in order table
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'total_price' => $totalPrice,
                ]);

                // store order items
                foreach ($orderItemsData as $data) {
                    $order->items()->create($data);
                }

                return response()->json([
                    'message' => 'Order placed successfully!',
                    'order_id' => $order->id,
                    'total_price' => $totalPrice
                ], 201);
            }
        });
    }
}
