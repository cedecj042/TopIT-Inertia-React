<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionDetailType;
use App\Enums\QuestionDifficulty;
use App\Enums\TestType;
use App\Http\Controllers\Controller;
use App\Http\Requests\PretestRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Log;

class PretestController extends Controller
{
    //
    public function index(){
        $query = Question::with(['course', 'question_detail'])->where('test_type','Pretest');

        if ($search = request('question')) {
            $search = strtolower($search); // Convert the search term to lowercase
        
            $query->where(function ($q) use ($search) {
                // Search in the question field (case-insensitive)
                $q->where(DB::raw('LOWER(question)'), 'like', '%' . $search . '%')
                  // Search in the answer field within the question_detail relationship (case-insensitive)
                  ->orWhereHas('question_detail', function ($q) use ($search) {
                      $q->where(DB::raw('LOWER(answer)'), 'like', '%' . $search . '%'); // Adjust if answer is JSON array
                  });
            });
        }

        if ($courseTitle = request('course')) {
            $query->whereHas('course', function ($q) use ($courseTitle) {
                $q->where('title', 'like', '%' . $courseTitle . '%');
            });
        }

        if ($difficulty = request('difficulty')) {
            $query->where('difficulty_type', $difficulty);
        }

        if ($detail_types = request('detail_types')) {
            $query->whereHas('question_detail', function ($q) use ($detail_types) {
                $q->where('type', $detail_types); // Assuming 'name' is the field in difficulty table
            });
        }
        

        $perPage = request('items', 5);
        $questions = $query->paginate($perPage)->onEachSide(1);

        $title =  DB::table('courses')->distinct()->pluck('title');
        $difficulty = QuestionDifficulty::cases();
        $questionDetailTypes = collect(QuestionDetailType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        // Add all filters to the filters array
        $filters = [
            'courses' => $title,
            'difficulty' => $difficulty,
            'detail_types' => $questionDetailTypes
        ];
        
        return Inertia::render('Admin/Questions/Pretest', [
            'title' => 'Admin Pretest',
            'questions' => QuestionResource::collection($questions), 
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function show(){
        $query = Question::with(['course', 'question_detail'])->where('test_type','Test');

        if ($search = request('question')) {
            $search = strtolower($search); // Convert the search term to lowercase
        
            $query->where(function ($q) use ($search) {
                // Search in the question field (case-insensitive)
                $q->where(DB::raw('LOWER(question)'), 'like', '%' . $search . '%')
                  // Search in the answer field within the question_detail relationship (case-insensitive)
                  ->orWhereHas('question_detail', function ($q) use ($search) {
                      $q->where(DB::raw('LOWER(answer)'), 'like', '%' . $search . '%'); // Adjust if answer is JSON array
                  });
            });
        }
        
        if ($courseTitle = request('course')) {
            $query->whereHas('course', function ($q) use ($courseTitle) {
                $q->where('title', 'like', '%' . $courseTitle . '%');
            });
        }

        if ($difficulty = request('difficulty')) {
            $query->where('difficulty_type', $difficulty);
        }
        if ($detail_types = request('detail_types')) {
            $query->whereHas('question_detail', function ($q) use ($detail_types) {
                $q->where('type', $detail_types); // Assuming 'name' is the field in difficulty table
            });
        }
        

        $perPage = request('items', 5);
        $questions = $query->paginate($perPage)->onEachSide(1);

        $title =  DB::table('courses')->distinct()->pluck('title');
        $difficulty = array_map(fn($case) => $case->value, QuestionDifficulty::cases());
        $questionDetailTypes = collect(QuestionDetailType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        // Add all filters to the filters array
        $filters = [
            'courses' => $title,
            'difficulty' => $difficulty,
            'detail_types' => $questionDetailTypes
        ];
        
        return Inertia::render('Admin/Questions/AddPretest',[
            'title' => 'Admin Pretest',
            'questions' => QuestionResource::collection($questions),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
        
    }
    public function add(PretestRequest $request)
    {
        $validated = $request->validated();

        Log::info($validated);

        foreach ($validated['questions'] as $id) { // Access the 'questions' array
            $question = Question::find($id);

            if ($question) {
                $question->test_type = TestType::PRETEST->value;
                $question->save(); // Save the updated model
            }
        }

        return redirect()->route('admin.pretest.index');
    }

}
