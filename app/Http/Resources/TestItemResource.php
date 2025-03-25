<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestItemResource extends JsonResource
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
            'participant_answer' => $this->participant_answer,
            'score' => $this->score,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y '),
            'updated_at' => Carbon::parse($this->updated_at)->format('F j, Y '),
            'question' => [
                'question_id' => $this->question->question_id,
                'question' => $this->question->question,
                'choices' => json_decode($this->question->choices),
                'question_type' => $this->question->question_type,
            ],
            'course' => $this->whenLoaded('assessment_course', function () {
                return new CourseResource($this->assessment_course->course);
            }),
            'assessment' => $this->whenLoaded('assessment_course', function () {
                return [
                    'assessment_id' => $this->assessment_course->assessment->assessment_id,
                    'start_time' => $this->assessment_course->assessment->start_time,
                    'status' => $this->assessment_course->assessment->status,
                    'created_at' => Carbon::parse($this->assessment_course->assessment->created_at)->format('F j, Y'),
                    'updated_at' => Carbon::parse($this->assessment_course->assessment->updated_at)->format('F j, Y'),
                ];
            }),
        ];
    }
}
