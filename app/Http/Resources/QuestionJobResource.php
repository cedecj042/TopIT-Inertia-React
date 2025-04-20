<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionJobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'question_job_id'=>$this->question_job_id,
            'course_id'=>$this->course_id,
            'total_very_easy'=>$this->total_very_easy,
            'total_easy'=>$this->total_easy,
            'total_average'=>$this->total_average,
            'total_hard'=>$this->total_hard,
            'total_very_hard'=>$this->total_very_hard,
            'total_questions'=>$this->total_questions,
            'status'=>$this->status,
            'generated_by'=>$this->generated_by,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y'), 
            'updated_at' => Carbon::parse($this->updated_at)->format('F j, Y'),
        ];
    }
}
