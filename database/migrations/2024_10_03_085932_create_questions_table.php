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
        // Schema::create('',function (Blueprint $table){
        //     $table->id('identification_id');
        //     $table->string('name');
        //     $table->string('answer');
        //     $table->timestamps();
        // });
        // Schema::create('multichoice_single',function (Blueprint $table){
        //     $table->id('multichoice_single_id');
        //     $table->string('name');
        //     $table->string('answer');
        //     $table->json('choices');
        //     $table->timestamps();
        // });
        // Schema::create('multichoice_many',function (Blueprint $table){
        //     $table->id('multichoice_many_id');
        //     $table->string('name');
        //     $table->json('answer');
        //     $table->json('choices');
        //     $table->timestamps();
        // });

        // Schema::create('difficulty', function (Blueprint $table) {
        //     $table->id('difficulty_id');
        //     $table->string('name');
        //     $table->float('numeric');
        //     $table->timestamps();
        // });


        // Schema::create('question_details',function (Blueprint $table){
        //     $table->id('question_detail_id');
        //     $table->enum('type',['Identification','Multiple Choice - Single','Multiple Choice - Many']);
        //     $table->json('answer');
        //     $table->json('choices')->nullable();
        //     $table->boolean('requires_all_answer')->nullable();
        //     $table->timestamps();
        // });

        Schema::create('questions', function (Blueprint $table) {
            $table->id('question_id');
            $table->string('question_uid')->nullable();
            $table->foreignId('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
            $table->enum('test_type', ['Pretest', 'Test']);
            $table->longText('question');
            $table->float('discrimination_index');
            $table->float('difficulty_value');
            $table->enum('difficulty_type', ['Very Easy', 'Easy', 'Average', 'Hard', 'Very Hard']);
            $table->enum('question_type',['Identification','Multiple Choice - Single','Multiple Choice - Many']);
            $table->json('answer');
            $table->json('choices')->nullable();
            $table->timestamps();
        });
        Schema::create('question_recalibration_logs', function (Blueprint $table) {
            $table->id('log_id');
            $table->foreignId('question_id')->references('question_id')->on('questions')->cascadeOnDelete();
            $table->foreignID('recalibration_id')->references('recalibration_id')->on('recalibrations')->cascadeOnDelete();
            $table->enum('previous_difficulty_type',['Very Easy','Easy','Average','Hard','Very Hard']);
            $table->enum('new_difficulty_type',['Very Easy','Easy','Average','Hard','Very Hard']);
            $table->float('previous_difficulty_value');
            $table->float('new_difficulty_value');
            $table->float('previous_discrimination_index');
            $table->float('new_discrimination_index');
            $table->float('standard_error_discrimination');
            $table->float('standard_error_difficulty');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('question_details');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('question_recalibration_logs');
    }
};