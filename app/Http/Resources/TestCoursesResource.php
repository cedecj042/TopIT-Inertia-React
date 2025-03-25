<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestCoursesResource extends JsonResource
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
            'course_id' => $this->course_id,
            'course' => new CourseResource($this->course),
            'assessment_items' => TestItemResource::collection($this->whenLoaded('assessment_items')),
            'assessment' => new AssessmentResource($this->whenLoaded('assessment'))
        ];
    }
}
