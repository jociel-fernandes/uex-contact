<?php

use Illuminate\Support\Facades\Route;

// Route::get('/{any?}', function () {
//     return view('welcome');
// })->where('any', '.*');

Route::get('/', function () {
    return view('welcome');
});

require __DIR__.'/auth.php';