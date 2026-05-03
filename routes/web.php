<?php

use Illuminate\Support\Facades\Route;

// root route that load the application
Route::get('/', function () {
    return view('welcome');
});

// fallback for undefined urls
Route::fallback(function () {
    return view('welcome');
});
