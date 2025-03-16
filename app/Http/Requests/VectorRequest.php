<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VectorRequest extends FormRequest
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
            'courses' => 'required|array', // Ensure 'courses' is an array
            'courses.*' => 'array', // Each course should be an array of module IDs
            'courses.*.*' => 'string', // Each module ID should be an integer
        ];
    }
}
