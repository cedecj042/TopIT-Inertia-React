<?php

namespace App\Providers;

use App\Models\Course;
use App\Models\Module;
use App\Models\Question;
use App\Models\Student;
use App\Observers\CourseObserver;
use App\Observers\ModuleObserver;
use App\Observers\QuestionObserver;
use App\Observers\StudentObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Course::observe(CourseObserver::class);
        Student::observe(StudentObserver::class);
        Module::observe(ModuleObserver::class);
        Question::observe(QuestionObserver::class);
    }
}
