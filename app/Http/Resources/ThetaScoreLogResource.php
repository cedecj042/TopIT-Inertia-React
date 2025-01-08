<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThetaScoreLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'theta_score_log_id' => $this->theta_score_log_id,
            'assessment_item_id' => $this->assessment_item_id,
            'assessment_course_id' => $this->assessment_course_id,
            'previous_theta_score' => $this->previous_theta_score,
            'new_theta_score' => $this->new_theta_score,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y'), 
            'updated_at' => Carbon::parse($this->updated_at)->format('F j, Y'), 
            'assessment_course'=> new AssessmentCourseResource($this->whenLoaded('assessment_course')),
            'assessment_item'=> new AssessmentItemResource($this->whenLoaded('assessment_item')),
        ];
    }
}
