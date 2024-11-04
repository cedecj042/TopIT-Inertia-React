<?php

namespace App\Http\Resources;

use App\Models\Assessment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentCourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'assessment_course_id' => $this->assessment_course_id,
            'assessment_id' => $this->assessment_id,
            'course_id' => $this->student_id,
            'total_items' => $this->totalItems,
            'total_score' => $this->totalScore,
            'theta_score' => $this->theta_score,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y '), 
            'updated_at' => Carbon::parse(time: $this->updated_at)->format('F j, Y '), 
            'assessment'=> new Assessment($this->whenLoaded('assessment')),
            'assessment_items'=> AssessmentItemResource::collection($this->whenLoaded('assessment_items')),
        ];
    }
}
