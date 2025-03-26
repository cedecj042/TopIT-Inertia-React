<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\GenerateAssessmentJob;
use App\Models\Student;

class GenerateAssessments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-assessments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate 50 assessments for each student';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting assessment generation for all students...');

        $students = Student::all();

        foreach ($students as $student) {
            GenerateAssessmentJob::dispatchSync($student);
            $this->info("Completed assessment job for Student ID: {$student->student_id}");
        }

        $this->info('All assessment jobs have been dispatched.');
    }
}
