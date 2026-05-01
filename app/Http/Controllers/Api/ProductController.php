<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::select('id', 'name', 'price', 'stock')->latest()->paginate(10);

        if ($products->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'No products found.',
                'data' => []
            ], 200);
        }

        return response()->json($products);
    }
}
