<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'assessment_item_id' => $this->assessment_item_id,
            'assessment_course_id' => $this->assessment_course_id,
            'question_id' => $this->question_id,
            'participants_answer' => $this->participants_answer,
            'score' => $this->score,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y '), 
            'updated_at' => Carbon::parse( $this->updated_at)->format('F j, Y '), 
            'assessment_course'=> new AssessmentCourseResource($this->whenLoaded('assessment_course')),
            'question'=> new QuestionResource($this->whenLoaded('question')),
        ];
    }
}
