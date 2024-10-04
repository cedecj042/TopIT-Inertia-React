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
        Schema::create('identifications',function (Blueprint $table){
            $table->id('identification_id');
            $table->string('name');
            $table->string('answer');
            $table->timestamps();
        });
        Schema::create('multichoice_single',function (Blueprint $table){
            $table->id('multichoice_single_id');
            $table->string('name');
            $table->string('answer');
            $table->json('choices');
            $table->timestamps();
        });
        Schema::create('multichoice_many',function (Blueprint $table){
            $table->id('multichoice_many_id');
            $table->string('name');
            $table->json('answer');
            $table->json('choices');
            $table->timestamps();
        });
        Schema::create('difficulty', function(Blueprint $table){
            $table->id('difficulty_id');
            $table->string('name');
            $table->float('numeric');
            $table->timestamps();
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->id('question_id');
            $table->foreignID('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
            $table->unsignedBigInteger('questionable_id'); // Standard naming for polymorphic ID
            $table->string('questionable_type'); // Standard naming for polymorphic type
            $table->foreignID('difficulty_id')->references('difficulty_id')->on('difficulty')->cascadeOnDelete();
            $table->string('question');
            $table->float('discrimination_index');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
        Schema::dropIfExists('difficulty');
        Schema::dropIfExists('identifications');
        Schema::dropIfExists('multichoice_single');
        Schema::dropIfExists('multichoice_many');
    }
};