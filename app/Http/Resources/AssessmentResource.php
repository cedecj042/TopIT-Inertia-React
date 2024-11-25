<?php

namespace App\Http\Resources;

use App\Models\Assessment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;


class AssessmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'assessment_id' => $this->assessment_id,
            'student_id' => $this->student_id,
            'start_time' => Carbon::parse($this->start_time)->format('g:i A'), 
            'end_time' => Carbon::parse($this->end_time)->format('g:i A'), 
            'total_items' => $this->total_items,
            'total_score' => $this->total_score,
            'percentage' => $this->percentage,
            'status' => $this->status,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y'), 
            'updated_at' => Carbon::parse($this->updated_at)->format('F j, Y'), 
            'assessment_courses'=> AssessmentCourseResource::collection($this->whenLoaded('assessment_courses')),
        ];
    }
}
