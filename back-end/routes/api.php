<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContactTypeController;
use App\Http\Controllers\Api\UserController;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('contacts', ContactController::class);
    Route::apiResource('contact-types', ContactTypeController::class);
    Route::get('address/{zip_code}', [AddressController::class, 'getAddressByZipCode']);

    Route::get('/user', [UserController::class, 'show']);
    Route::patch('/user', [UserController::class, 'update']);
    Route::post('/user', [UserController::class, 'destroy']);
});