<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::put('profile', [AuthController::class, 'updateProfile'])
            ->middleware('role:admin');
        Route::post('profile/password', [AuthController::class, 'updatePassword'])
            ->middleware('role:admin');

        Route::get('dashboard', [DashboardController::class, 'summary'])
            ->middleware('role:admin,manager,editor');

        Route::get('audit-logs', [AuditLogController::class, 'index'])
            ->middleware('role:admin');

        Route::get('categories', [CategoryController::class, 'index'])
            ->middleware('role:admin,manager,editor');
        Route::get('categories/{category}', [CategoryController::class, 'show'])
            ->middleware('role:admin,manager,editor');
        Route::post('categories', [CategoryController::class, 'store'])
            ->middleware('role:admin');
        Route::put('categories/{category}', [CategoryController::class, 'update'])
            ->middleware('role:admin');
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])
            ->middleware('role:admin');

        Route::apiResource('products', ProductController::class)
            ->middleware('role:admin,manager,editor');

        Route::get('inventories', [InventoryController::class, 'index'])
            ->middleware('role:admin,manager,editor');
        Route::get('inventories/{inventory}', [InventoryController::class, 'show'])
            ->middleware('role:admin,manager,editor');
        Route::post('inventories', [InventoryController::class, 'store'])
            ->middleware('role:admin,manager');
        Route::put('inventories/{inventory}', [InventoryController::class, 'update'])
            ->middleware('role:admin,manager');
        Route::delete('inventories/{inventory}', [InventoryController::class, 'destroy'])
            ->middleware('role:admin,manager');
    });
});
