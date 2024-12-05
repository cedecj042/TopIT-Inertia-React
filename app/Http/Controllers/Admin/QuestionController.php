<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionDetailType;
use App\Enums\QuestionDifficulty;
use App\Enums\QuestionTestType;
use App\Enums\TestType;
use App\Http\Controllers\Controller;
use App\Http\Requests\EditQuestionRequest;
use App\Http\Requests\GenerateQuestionRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\DifficultyResource;
use App\Http\Resources\QuestionResource;
use App\Jobs\GenerateQuestionJob;
use App\Jobs\ProcessQuestionsJob;
use App\Models\Course;
use App\Models\Difficulty;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $query = Question::query()->with(['question_detail','course'])->where('test_type','Test');

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
        
        $testTypes = collect(TestType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();
    
        // Add all filters to the filters array
        $filters = [
            'courses' => $title,
            'difficulty' => $difficulty,
            'detail_types' => $questionDetailTypes
        ];
        
        return Inertia::render('Admin/Questions/Question',[
            'title' => 'Admin Question',
            'auth' => Auth::user(),
            'questions' => QuestionResource::collection($questions),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function generate(GenerateQuestionRequest $request){
        $validatedData = $request->validated();
        GenerateQuestionJob::dispatch($validatedData);
        return redirect()->back()->with('message', 'Generating questions based on the selected courses.');
    }


    public function show()
    {
        //
        $courses = Course::with('modules')->get();
        $difficulty = array_map(fn($case) => $case->value, QuestionDifficulty::cases());
        return Inertia::render('Admin/Questions/Generate',[
            'title' => 'Admin Question',
            'auth' => Auth::user(),
            'courses' => CourseResource::collection($courses),
            'difficulty' => $difficulty,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id,EditQuestionRequest $request)
    {
        //
        $validated = $request->validated();
        Log::info($validated);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditQuestionRequest $request, string $id)
    {
        $validated = $request->validated();

        // Fetch the question with related data
        $question = Question::with(['course', 'question_detail'])->findOrFail($validated['question_id']);

        // Update course if changed
        if ($question->course->title !== $validated['course']) {
            $course = Course::where('title', $validated['course'])->firstOrFail();
            $question->course_id = $course->course_id;
        }

        // Save relationship changes
        if ($question->isDirty(['course_id', 'difficulty_id'])) {
            $question->save();
        }
        // Prepare JSON-encoded values for answer and choices
        $encodedAnswer = json_encode($validated['answer']);
        $encodedChoices = json_encode($validated['choices'] ?? []);

        // Update question_detail if any relevant field has changed
        $questionDetail = $question->question_detail;
        if (
            $questionDetail->type !== $validated['question_detail_type'] ||
            $questionDetail->answer !== $encodedAnswer ||
            $questionDetail->choices !== $encodedChoices
        ) {
            $questionDetail->update([
                'type' => $validated['question_detail_type'],
                'answer' => $encodedAnswer,
                'choices' => $encodedChoices,
            ]);
        }

        // Update question attributes
        $question->update([
            'question' => $validated['question'],
            'discrimination_index' => $validated['discrimination_index'],
            'difficulty_value' => $validated['difficulty_value'],
            'difficulty_type' => $validated['difficulty'],
        ]);

        return redirect()->back()->with('success', 'Successfully updated');
    }

    public function delete(string $id)
    {
        //
        $question = Question::with('question_detail')->findOrFail($id);
        $question->question_detail->delete();
        $question->delete();
        return redirect()->back()->with('success', 'Deleted Successfully');
    }
    public function courses(){
        $courses = Course::all();
        $difficulty = array_map(fn($case) => $case->value, QuestionDifficulty::cases());
        $questionDetailTypes = collect(QuestionDetailType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();
        return response()->json(['courses' => $courses,'difficulty' =>$difficulty,'question_detail_types'=>$questionDetailTypes]);
    }
    public function store(Request $request)
    {
        $data = $request->json()->all();
        // Dispatch the job
        ProcessQuestionsJob::dispatch($data);
        return redirect()->back()->with('success', 'Deleted Successfully');
    }
    
}
