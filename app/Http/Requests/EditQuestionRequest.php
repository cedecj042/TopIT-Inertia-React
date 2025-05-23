<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'question_id' => 'required|int',
            'difficulty'=>'required|in:Very Easy,Easy,Average,Hard,Very Hard',
            'difficulty_value'=>'required|numeric',
            'discrimination_index' => 'required|numeric',
            'question' => 'required|string',
            'question_type'=> 'required|in:Multiple Choice - Single,Multiple Choice - Many,Identification',
            'answer' => ['required', function ($attribute, $value, $fail) {
                if (!in_array(gettype($value), ['string', 'array'])) {
                    $fail("The $attribute must be either a string or an array.");
                }
            }],
            'choices' => 'array',
            'course_title' => 'required|exists:courses,title',
        ];
    }
}
