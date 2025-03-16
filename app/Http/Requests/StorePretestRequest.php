<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StorePretestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [    
            'assessment_id' => ['required', 'exists:assessments,assessment_id'],
            'assessment_items' => ['required', 'array'],
            'assessment_items.*.assessment_course_id' => ['required','integer','exists:assessment_courses,assessment_course_id'],
            'assessment_items.*.assessment_item_id' => ['required', 'exists:assessment_items,assessment_item_id'],
            'assessment_items.*.question_id' => ['required', 'exists:questions,question_id'],
            'assessment_items.*.participant_answer' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if (!is_string($value) && !is_array($value)) {
                        $fail("$attribute must be either a string or an array.");
                    }
                },
            ]
        ];
    }

    public function messages()
    {
        return [
            'assessment_id.required' => 'Assessment ID is required.',
            'assessment_items.required' => 'Please complete the pretest.',
            'assessment_items.*.assessment_course_id.exists' => 'Assessment Course does not exist',
            'assessment_items.*.assessment_item_id.exists' => 'Assessment item does not exist',
        ];
    }
}
