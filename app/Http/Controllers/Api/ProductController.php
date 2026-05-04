<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // get paginated product list with filter
    public function index(Request $request)
    {
        $query = Product::select('id', 'name', 'price', 'stock');

        if ($request->filled('search')) {
            $search = $request->string('search')->trim();
            // case insensitive name filter 
            $query->whereRaw('name ILIKE ?', ["%{$search}%"]);
        }

        $products = $query->latest()->paginate(2);

        return response()->json($products);
    }
}
