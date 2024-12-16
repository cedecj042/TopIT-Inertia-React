<?php

namespace App\Http\Resources;

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
            'course_id' => $this->course_id,
            'total_items' => $this->total_items,
            'total_score' => $this->total_score,
            'theta_score' => $this->theta_score,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y '), 
            'updated_at' => Carbon::parse(time: $this->updated_at)->format('F j, Y '), 
            'course' => new CourseResource(($this->whenLoaded('course'))),
            'assessment'=> new AssessmentResource($this->whenLoaded('assessment')),
            'assessment_items'=> AssessmentItemResource::collection($this->whenLoaded('assessment_items')),
        ];
    }
}
