<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionDifficulty;
use App\Enums\QuestionType;
use App\Enums\TestType;
use App\Http\Controllers\Controller;
use App\Http\Requests\EditQuestionRequest;
use App\Http\Requests\GenerateQuestionRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\QuestionResource;
use App\Jobs\GenerateQuestionJob;
use App\Jobs\ProcessQuestionsJob;
use App\Models\Course;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class QuestionController extends Controller
{
    public function index()
    {
        //
        $query = Question::query()->with('course')->where('test_type', 'Test');

        if ($search = request('question')) {
            $search = strtolower($search); // Convert the search term to lowercase

            if ($search = request('question')) {
                $query->where(function ($q) use ($search) {
                    $q->whereRaw('LOWER(question) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereRaw('LOWER(answer) LIKE ?', ['%' . strtolower($search) . '%']);
                });
            }
        }

        if ($courseTitle = request('course')) {
            $query->whereHas('course', function ($q) use ($courseTitle) {
                $q->where('title', 'like', '%' . $courseTitle . '%');
            });
        }

        if ($difficulty = request('difficulty')) {
            $query->where('difficulty_type', $difficulty);
        }
        if ($question_type = request('question_type')) {
            $query->where('question_type', $question_type);
        }

        $perPage = request('items', 5);
        $questions = $query->paginate($perPage)->onEachSide(1);

        $title = Course::select('title')->distinct()->pluck('title');
        $difficulty = array_map(fn($case) => $case->value, QuestionDifficulty::cases());
        $questionTypes = collect(QuestionType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        $testTypes = collect(TestType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        // Add all filters to the filters array
        $filters = [
            'courses' => $title,
            'difficulty' => $difficulty,
            'question_type' => $questionTypes
        ];

        return Inertia::render('Admin/Questions/Question', [
            'title' => 'Admin Question',
            'questions' => QuestionResource::collection($questions),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function generate(GenerateQuestionRequest $request)
    {
        $validatedData = $request->validated();
        GenerateQuestionJob::dispatch($validatedData);
        return redirect()->back()->with('message', 'Generating questions based on the selected courses.');
    }


    public function show()
    {
        $courses = Course::with('modules')->get();
        $difficulty = array_map(fn($case) => $case->value, QuestionDifficulty::cases());
        return Inertia::render('Admin/Questions/Generate', [
            'title' => 'Admin Question',
            'courses' => CourseResource::collection($courses),
            'difficulty' => $difficulty,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditQuestionRequest $request, Question $question)
    {
        $validated = $request->validated();

        // Update course if changed
        if ($question->course->course_id !== $validated['course_id']) {
            $question->course_id = Course::where('course_id', $validated['course_id'])->firstOrFail()->course_id;
        }

        $validated['answer'] = is_array($validated['answer']) ? json_encode($validated['answer']) : $validated['answer'];
        $validated['choices'] = !empty($validated['choices']) ? json_encode($validated['choices']) : null;

        $question->update($validated);

        return redirect()->back()->with('success', 'Successfully updated');
    }

    public function delete(Question $question)
    {
        $question->delete();
        return redirect()->back()->with('success', 'Deleted Successfully');
    }
    public function courses()
    {
        $courses = Course::all();
        $difficulty = array_map(fn($case) => $case->value, QuestionDifficulty::cases());
        $questionTypes = collect(QuestionType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();
        return response()->json(['courses' => $courses, 'difficulty' => $difficulty, 'question_type' => $questionTypes]);
    }
    public function store(Request $request)
    {
        $data = $request->json()->all();
        // Dispatch the job
        ProcessQuestionsJob::dispatch($data);
        return redirect()->back()->with('success', 'Deleted Successfully');
    }

}
