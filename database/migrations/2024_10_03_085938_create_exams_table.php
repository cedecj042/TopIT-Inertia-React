<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assessments',function (Blueprint $table){
            $table->id('assessment_id');
            $table->foreignID('student_id')->references('student_id')->on('students')->cascadeOnDelete();
            $table->enum('type',['Pretest','Test']);
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->integer('total_items');
            $table->integer('total_score')->nullable();
            $table->float('percentage')->nullable();
            $table->enum('status',['Not Started','In Progress','Completed']);
            $table->timestamps();
        });
        Schema::create('assessment_courses',function(Blueprint $table){
            $table->id('assessment_course_id');
            $table->foreignID('assessment_id')->references('assessment_id')->on('assessments')->cascadeOnDelete();
            $table->foreignID('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
            $table->integer('total_items');
            $table->integer('total_score')->nullable();
            $table->float('initial_theta_score');
            $table->float('final_theta_score')->nullable(); //or default(0)? getting this error Field 'final_theta_score' and 'initial_theta_score doesn't have a default value if wala
            $table->float('percentage')->nullable();
            $table->timestamps();
        });
        Schema::create('assessment_items',function (Blueprint $table){
            $table->id('assessment_item_id');
            $table->foreignID('assessment_course_id')->references('assessment_course_id')->on('assessment_courses')->cascadeOnDelete();
            $table->foreignID('question_id')->references('question_id')->on('questions')->cascadeOnDelete();
            $table->json('participants_answer')->nullable();
            $table->enum('status',['In Progress','Completed'])->default('In Progress');
            $table->integer( 'score')->default(0);
            $table->timestamps();
        });
        
        Schema::create('theta_score_logs',function (Blueprint $table){
            $table->id('theta_score_log_id');
            $table->foreignID('assessment_item_id')->references('assessment_item_id')->on('assessment_items')->cascadeOnDelete();
            $table->foreignID('assessment_course_id')->references('assessment_course_id')->on('assessment_courses')->cascadeOnDelete();
            $table->float('previous_theta_score');
            $table->float('new_theta_score');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('assessment_courses');
        Schema::dropIfExists('assessment_items');
        Schema::dropIfExists('theta_score_logs');
    }
};