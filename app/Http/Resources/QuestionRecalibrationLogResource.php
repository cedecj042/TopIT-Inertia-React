<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionRecalibrationLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'question_id' => $this->question_id,
            'question' => optional($this->question)->question,
            'previous_difficulty_type'=> $this->previous_difficulty_type,
            'previous_difficulty_value'=> $this->previous_difficulty_value,
            'previous_discrimination_index' => $this->previous_discrimination_index,
            'new_difficulty_type'=> $this->new_difficulty_type,
            'new_difficulty_value'=> $this->new_difficulty_value,
            'new_discrimination_index' => $this->new_discrimination_index,
            'total_count' => optional($this->question)->assessment_items_count ?? 0,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d'), 
            'updated_at' => Carbon::parse(time: $this->updated_at)->format('Y-m-d'), 
            'question_data' => new QuestionResource( $this->whenLoaded('question')),
        ];
    }
}
