<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionReviewResource extends JsonResource
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
            'course_id' => $this->course_id,
            'question_detail_id' => $this->question_detail_id,
            'test_type' => $this->test_type,
            'question' => $this->question,
            'discrimination_index' => $this->discrimination_index,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y '), 
            'updated_at' => Carbon::parse(time: $this->updated_at)->format('F j, Y '), 
            'question_detail' => new QuestionDetailResource($this->whenLoaded('question_detail')), 
            'difficulty_type'=> $this->difficulty_type,
            'difficulty_value'=> $this->difficulty_type,
            'course' => new CourseResource($this->whenLoaded('course')),
            #added for review
            'student_answer' => $this->student_answer,
            'is_multiple_answer' => $this->is_multiple_answer,
            'is_correct' => $this->is_correct,
        ];
    }
}
