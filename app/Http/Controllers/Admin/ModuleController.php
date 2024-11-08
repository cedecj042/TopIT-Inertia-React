<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AttachmentType;
use App\Http\Controllers\Controller;
use App\Http\Resources\ModuleResource;
use App\Models\Content;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Section;
use App\Models\Subsection;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ModuleController extends Controller
{
    protected function resolveModelClass($type)
    {
        $mapping = [
            'Module' => \App\Models\Module::class,
            'Lesson' => \App\Models\Lesson::class,
            'Section' => \App\Models\Section::class,
            'Subsection' => \App\Models\Subsection::class,
        ];

        return $mapping[$type] ?? null;
    }
    protected function getModuleId($contentableType, $contentableId)
    {
        if ($contentableType === 'Module') {
            return $contentableId;
        }
        
        $modelClass = $this->resolveModelClass($contentableType);
        if (!$modelClass) {
            throw new Exception('Invalid contentable_type');
        }

        $parentModel = $modelClass::findOrFail($contentableId);
        return $parentModel->module->module_id; // Assumes `module` relationship exists in each model
    }

    public function index()
    {
        $query = Module::with(['course:course_id,title']);


        if ($title = request('title')) {
            $query->where('title', 'like', '%' . $title . '%');
        }
        // Filter by course_id if provided
        if ($courseTitle = request('course')) {
            // Query the course table to get the course_id based on the course title
            $course = DB::table('courses')->where('title', 'like', '%' . $courseTitle . '%')->first();

            if ($course) {
                $query->where('course_id', $course->course_id);
            } else {
                $query->whereNull('course_id');
            }
        }

        $perPage = request('items', 5);
        $modules = $query->paginate($perPage)->onEachSide(1);

        $title =  DB::table('courses')->distinct()->pluck('title');
        $filters = [
            'courses' => $title
        ];
        return Inertia::render('Admin/Modules/Module', [
            'title' => 'Admin Module',
            'auth' => Auth::user(),
            'modules' => ModuleResource::collection($modules),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function show(string $id)
    {
        // Define a closure to apply ordering by 'order' column
        $orderAttachments = function ($query) {
            $query->orderBy('order');
        };

        // Eager load relationships with ordered attachments
        $module = Module::with([
            'course:course_id,title', // Load only necessary columns from course
            'contents' => $orderAttachments,
            'lessons.contents' => $orderAttachments,
            'lessons.sections.contents' => $orderAttachments,
            'lessons.sections.subsections.contents' => $orderAttachments,
        ])->findOrFail($id);

        // Return the Inertia render with the module details
        return Inertia::render('Admin/Modules/ModuleDetail', [
            'title' => 'Admin Module',
            'auth' => Auth::user(),
            'module' => new ModuleResource($module)
        ]);
    }

    public function edit(string $id)
    {
        // Define a closure to apply ordering by 'order' column
        $orderAttachments = function ($query) {
            $query->orderBy('order');
        };
        // Eager load all contents at each level without filtering by type
        $module = Module::with([
            'course:course_id,title', // Load only necessary columns from course
            'contents' => $orderAttachments,
            'lessons.contents' => $orderAttachments,
            'lessons.sections.contents' => $orderAttachments,
            'lessons.sections.subsections.contents' => $orderAttachments,
        ])->findOrFail($id);

        // Return the Inertia render with the module details
        return Inertia::render('Admin/Modules/ModuleEdit', [
            'title' => 'Admin Module',
            'auth' => Auth::user(),
            'module' => new ModuleResource($module),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, $contentableId)
    {
        // Validate the request data, making 'contents' optional
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'contents' => 'nullable|array', // 'nullable' allows 'contents' to be empty
            'contents.*.content_id' => 'required_with:contents|exists:contents,content_id', // only required if 'contents' is provided
            'contents.*.order' => 'required_with:contents|integer', // only required if 'contents' is provided
            'contentable_type' => 'required|string|in:Module,Lesson,Section,Subsection',
        ]);


        // Use resolveModelClass to get the model class
        $contentableClass = $this->resolveModelClass($validatedData['contentable_type']);
        
        if (!$contentableClass) {
            Log::error('Invalid contentable_type');
            throw new Exception('Invalid contentable_type');
        }

        // Find the contentable model by ID
        $contentable = $contentableClass::findOrFail($contentableId);

        // Update the title
        $contentable->title = $validatedData['title'];
        $contentable->save();

        // Update the order of contents only if contents are provided
        if (!empty($validatedData['contents'])) {
            foreach ($validatedData['contents'] as $contentData) {
                Content::where('content_id', $contentData['content_id'])
                    ->update(['order' => $contentData['order']]);
                // Log each content update
                Log::info('Updated content order:', $contentData);
            }
        } else {
            Log::info('No contents to update.');
        }

        $moduleId = $this->getModuleId($validatedData['contentable_type'],$contentableId);
        Log::info($moduleId);

        return redirect()->route('admin.module.edit', [
            'id' => $moduleId,
            'contentableId' => $contentableId,
            'contentableType' => $validatedData['contentable_type'],
        ])->with('success', 'Updated Successfully');
    }

    public function deleteModule(int $id) {

        $content = Module::findOrFail($id);
        $content->delete();
        
        return redirect()->back()->with('success', 'Deleted Successfully');

    }
    public function deleteLesson(int $id) {

        $content = Lesson::findOrFail($id);
        $content->delete();
        
        return redirect()->back()->with('success', 'Deleted Successfully');

    }
    public function deleteSection(int $id) {

        $content = Section::findOrFail($id);
        $content->delete();
        
        return redirect()->back()->with('success', 'Deleted Successfully');

    }
    public function deleteSubsection(int $id) {

        $content = Subsection::findOrFail($id);
        $content->delete();
        
        return redirect()->back()->with('success', 'Deleted Successfully');

    }
}
