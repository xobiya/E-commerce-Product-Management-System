<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary()
    {
        $endDate = Carbon::today();
        $startDate = $endDate->copy()->subDays(13);

        $trendRows = AuditLog::query()
            ->selectRaw('date(created_at) as date, count(*) as updates')
            ->where('entity_type', 'Inventory')
            ->whereIn('action', ['created', 'updated'])
            ->whereBetween('created_at', [
                $startDate->copy()->startOfDay(),
                $endDate->copy()->endOfDay(),
            ])
            ->groupBy(DB::raw('date(created_at)'))
            ->orderBy('date')
            ->pluck('updates', 'date');

        $stockTrends = [];
        $cursor = $startDate->copy();
        while ($cursor->lte($endDate)) {
            $dateKey = $cursor->toDateString();
            $stockTrends[] = [
                'date' => $dateKey,
                'updates' => (int) ($trendRows[$dateKey] ?? 0),
            ];
            $cursor->addDay();
        }

        $lowStockQuery = Inventory::query()->whereColumn('quantity', '<=', 'reorder_level');
        $lowStockCount = (clone $lowStockQuery)->count();
        $lowStockItems = (clone $lowStockQuery)
            ->with('product')
            ->orderBy('quantity')
            ->limit(6)
            ->get();

        $summary = [
            'totals' => [
                'products' => Product::count(),
                'categories' => Category::count(),
                'inventory_records' => Inventory::count(),
                'low_stock' => $lowStockCount,
            ],
            'low_stock_items' => $lowStockItems,
            'recent_activity' => Inventory::query()
                ->with('product')
                ->orderBy('updated_at', 'desc')
                ->limit(6)
                ->get(),
            'stock_trends' => $stockTrends,
        ];

        return response()->json($summary);
    }
}
