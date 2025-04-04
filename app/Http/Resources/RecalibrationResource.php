<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecalibrationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'recalibration_id' => $this->recalibration_id,
            'total_question_logs' => $this->total_question_logs,
            'status' => $this->status,
            'recalibrated_by' => $this->recalibrated_by,
            'created_at'=> (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at'=> (new Carbon($this->updated_at))->format('Y-m-d'),
            'questions'=> QuestionRecalibrationLogResource::collection($this->whenLoaded('question_recalibrations')),
        ];
    }
}
