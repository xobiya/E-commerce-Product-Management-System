<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditLogObserver
{
    public function created(Model $model): void
    {
        $this->record($model, 'created', $model->getAttributes());
    }

    public function updated(Model $model): void
    {
        $changes = $model->getChanges();
        unset($changes['updated_at']);

        if (empty($changes)) {
            return;
        }

        $this->record($model, 'updated', $changes);
    }

    public function deleted(Model $model): void
    {
        $this->record($model, 'deleted', $model->getAttributes());
    }

    private function record(Model $model, string $action, array $changes): void
    {
        if ($model instanceof AuditLog) {
            return;
        }

        AuditLog::create([
            'user_id' => optional(Auth::user())->id,
            'entity_type' => class_basename($model),
            'entity_id' => $model->getKey(),
            'action' => $action,
            'changes' => $changes,
        ]);
    }
}
