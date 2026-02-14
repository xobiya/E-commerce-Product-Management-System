<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuditLog::query()->with('user');

        if ($entityType = $request->query('entity_type')) {
            $logs->where('entity_type', $entityType);
        }

        if ($action = $request->query('action')) {
            $logs->where('action', $action);
        }

        $logs = $logs->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($logs);
    }
}
