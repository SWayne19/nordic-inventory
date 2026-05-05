<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;

// login api route
Route::post('/login', [AuthController::class, 'login']);

// route group with sanctum auth
Route::middleware('auth:sanctum')->group(function () {
    // product route
    Route::get('/products', [ProductController::class, 'index']);

    // order routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    // logout route
    Route::post('/logout', [AuthController::class, 'logout']);
});
