<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;


class TestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'test_id' => $this->test_id,
            'student_id' => $this->student_id,
            'start_time' => Carbon::parse($this->start_time)->format('g:i A'), 
            'end_time' => Carbon::parse($this->end_time)->format('g:i A'), 
            'total_items' => $this->totalItems,
            'total_score' => $this->totalScore,
            'percentage' => $this->percentage,
            'status' => $this->status,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y g:i A'), 
            'updated_at' => Carbon::parse($this->updated_at)->format('F j, Y '), 
        ];
    }
}
