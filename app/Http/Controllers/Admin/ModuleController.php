<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\VectorRequest;
use App\Http\Resources\ModuleResource;
use App\Jobs\ProcessModule;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Section;
use App\Models\Subsection;
use App\Services\ModuleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ModuleController extends Controller
{
    protected $moduleService;

    public function __construct(ModuleService $moduleService)
    {
        $this->moduleService = $moduleService;
    }


    public function index()
    {
        $modules = $this->moduleService->getFilteredModules(request());
    
        return Inertia::render('Admin/Modules/Module', [
            'title' => 'Admin Module',
            'modules' => ModuleResource::collection($modules['data']),
            'filters' => $modules['filters'],
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function show(string $module_id)
    {
        $module = $this->moduleService->getModuleWithDetails($module_id);
        return Inertia::render('Admin/Modules/ModuleDetail', [
            'title' => 'Admin Module',
            'queryParams' => request()->query() ?: null,
            'module' => new ModuleResource($module)
        ]);
    }

    public function edit(string $module_id)
    {
        $module = $this->moduleService->getModuleWithDetails($module_id);
        return Inertia::render('Admin/Modules/ModuleEdit', [
            'title' => 'Admin Module',
            'module' => new ModuleResource($module),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function update(Request $request, $contentableId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'contents' => 'nullable|array',
            'contents.*.content_id' => 'required_with:contents|exists:contents,content_id',
            'contents.*.order' => 'required_with:contents|integer',
            'contentable_type' => 'required|string|in:Module,Lesson,Section,Subsection',
        ]);

        $moduleId = $this->moduleService->updateContentable($validated, $contentableId);

        return redirect()->route('admin.module.edit', [
            'id' => $moduleId,
            'contentableId' => $contentableId,
            'contentableType' => $validated['contentable_type'],
        ])->with('success', 'Updated Successfully');
    }
    public function delete(string $module_id)
    {
        try {
            $module = Module::findOrFail($module_id);
            $module->delete();
            
            return redirect()->route('admin.module.index')->with('success', 'Module deleted successfully.');
        } catch (\Exception $e) {
            Log::error("Error deleting module: {$module_id}", ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Failed to delete the module.']);
        }
    }


    public function destroyContent($type, $id)
    {
        try {
            // Resolve the model class dynamically
            $modelClass = $this->moduleService->resolveModelClass(ucfirst($type));

            if (!$modelClass) {
                throw new \Exception('Invalid type specified.');
            }

            // Find and delete the model
            $model = $modelClass::findOrFail($id);
            $model->delete();

            return redirect()->back()->with('success', ucfirst($type) . ' deleted successfully.');
        } catch (\Exception $e) {
            Log::error("Error deleting {$type}: ", ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Failed to delete the content.']);
        }
    }

    public function deleteModule(string $id) {
        $content = Module::findOrFail($id);
        $content->delete();
        
        return redirect()->route('admin.module.index')->with('success', 'Module Deleted Successfully');
    }
    public function deleteLesson(string $id) {

        $content = Lesson::findOrFail($id);
        $moduleId = $content->module->module_id;
        $content->delete();
        
        return redirect()->route('admin.module.edit', [
            'id' => $moduleId,
            'contentableId' => $moduleId,
            'contentableType' => "Module",
        ])->with('success', 'Lesson Deleted Successfully');

    }
    public function deleteSection(string $id) {
        $content = Section::findOrFail($id);
        $moduleId = $content->lesson->module->module_id;
        $content->delete();
        
        return redirect()->route('admin.module.edit', [
            'id' => $moduleId,
            'contentableId' => $moduleId,
            'contentableType' => "Module",
        ])->with('success', 'Lesson Deleted Successfully');
    }
    public function deleteSubsection(string $id) {

        $content = Subsection::findOrFail($id);
        $moduleId = $content->section->lesson->module->module_id;
        $content->delete();
        
        return redirect()->route('admin.module.edit', [
            'id' => $moduleId,
            'contentableId' => $moduleId,
            'contentableType' => "Module",
        ])->with('success', 'Lesson Deleted Successfully');

    }


    public function courses()
    {
        return response()->json(['courses' => $this->moduleService->getCoursesWithModules()]);
    }

    public function vectorize(VectorRequest $request)
    {
        $validated = $request->validated();
        Log::info($validated);
        ProcessModule::dispatch($validated);
    }
}
