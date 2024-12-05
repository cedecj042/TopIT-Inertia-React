<?php

namespace Database\Seeders;

use App\Enums\QuestionDetailType;
use App\Enums\QuestionDifficulty;
use App\Enums\TestType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PretestQuestionSeeder extends Seeder
{
    public function run()
    {
        // Fetch all courses and difficulty levels
        $courses = DB::table('courses')->get();
        $difficulties = QuestionDifficulty::cases();

        $questions = [
            'Software Development' => [
                ['What is the process of managing tasks to achieve a goal in an organized way?', ['Project Management'], []], // Identification
                ['What does "Agile" mean in software development?', 'Iterative development', ['Iterative development', 'Waterfall model', 'Code design', 'Database design']], // MC Single
                ['Which of the following are Agile practices?', ['Scrum', 'Kanban'], ['Scrum', 'Kanban', 'Version control', 'Waterfall']], // MC Many
                ['What is version control?', 'Managing code changes', ['Managing code changes', 'Testing code', 'Analyzing requirements', 'Deploying software']], // MC Single
                ['Which tools are used for version control?', ['Git', 'SVN'], ['Git', 'SVN', 'Excel', 'Photoshop']], // MC Many
            ],
            'Understanding and Using Data' => [
                ['What term refers to the moral principles guiding business conduct?', ['Business Ethics'], []], // Identification
                ['What is the primary role of a database?', 'To store data', ['To store data', 'To analyze data', 'To visualize data', 'To back up files']], // MC Single
                ['Which are common databases?', ['MySQL', 'PostgreSQL'], ['MySQL', 'PostgreSQL', 'Excel', 'Notepad']], // MC Many
                ['What does ETL stand for?', 'Extract, Transform, Load', ['Extract, Transform, Load', 'Encode, Transfer, Launch', 'Examine, Tally, List', 'Edit, Test, Learn']], // MC Single
                ['What are steps in data analysis?', ['Data collection', 'Data cleaning'], ['Data collection', 'Data cleaning', 'Algorithm writing', 'System design']], // MC Many
            ],
            'Overview of System Architecture' => [
                ['What method is used to secure data by encoding it?', ['Encryption'], []], // Identification
                ['What is a client-server architecture?', 'A network model with clients and servers.', ['A network model with clients and servers', 'An operating system model', 'A programming paradigm', 'A database structure']], // MC Single
                ['Which are types of system architecture?', ['Client-server', 'Peer-to-peer'], ['Client-server', 'Peer-to-peer', 'Distributed', 'Monolithic']], // MC Many
                ['What does a system bus do?', 'Transfers data between components.', ['Transfers data between components.', 'Stores programs', 'Executes instructions', 'Monitors power usage']], // MC Single
                ['Which are parts of a system architecture?', ['Processor', 'Memory'], ['Processor', 'Memory', 'Mouse', 'Monitor']], // MC Many
            ],
            'Understanding Information Security' => [
                ['What does the acronym CPU stand for?', ['Central Processing Unit'], []], // Identification
                ['What is a firewall?', 'A tool to monitor and control network traffic.', ['A tool to monitor and control network traffic', 'A database backup tool', 'A network cable', 'A power surge protector']], // MC Single
                ['Which are information security threats?', ['Phishing', 'Ransomware'], ['Phishing', 'Ransomware', 'Firewall', 'Ethernet']], // MC Many
                ['What is multi-factor authentication?', 'Using multiple methods to verify identity.', ['Using multiple methods to verify identity.', 'Encrypting passwords', 'Storing passwords securely', 'Tracking logins']], // MC Single
                ['Which techniques improve security?', ['Encryption', 'Access control'], ['Encryption', 'Access control', 'Data duplication', 'Physical backups']], // MC Many
            ],
            'Understanding the IT Business and Ethics' => [
                ['What database query language is used to manage and manipulate data?', ['SQL', 'Structured Query Language'], []],
                ['What is corporate social responsibility (CSR)?', 'Managing a business to positively impact society.', ['Managing a business to positively impact society', 'A system for storing customer data', 'A tax management tool', 'A software licensing agreement']], // MC Single
                ['Which are IT ethical principles?', ['Confidentiality', 'Integrity'], ['Confidentiality', 'Integrity', 'Profitability', 'Growth']], // MC Many
                ['What is data privacy?', 'Protecting personal information from misuse.', ['Protecting personal information from misuse.', 'Securing hardware.', 'Backing up software.', 'Encrypting files.']], // MC Single
                ['Which are ethical IT issues?', ['Data misuse', 'Unlicensed software'], ['Data misuse', 'Unlicensed software', 'Slow networks', 'Large files']], // MC Many
            ],
            'Project Management & Technical Communication' => [
                ['In object-oriented programming (OOP), what is a blueprint for creating objects?', ['Class'], []],// Identification
                ['What is a Gantt chart used for?', 'Tracking project schedules.', ['Tracking project schedules.', 'Analyzing data trends.', 'Storing project files.', 'Organizing team members.']], // MC Single
                ['Which are project management methodologies?', ['Agile', 'Waterfall'], ['Agile', 'Waterfall', 'Critical Path', 'PERT']], // MC Many
                ['What is the role of a project manager?', 'To oversee project progress.', ['To oversee project progress.', 'To write code.', 'To manage servers.', 'To design systems.']], // MC Single
                ['Which are technical communication tools?', ['Presentations', 'Reports'], ['Presentations', 'Reports', 'Emails', 'Whiteboards']], // MC Many
            ]
        ];

        // Loop over each course
        $difficultyRanges = [
            QuestionDifficulty::VERY_EASY->value => [-5, -3],
            QuestionDifficulty::EASY->value => [-3, -1],
            QuestionDifficulty::AVERAGE->value => [-1, 1],
            QuestionDifficulty::HARD->value => [1, 3],
            QuestionDifficulty::VERY_HARD->value => [3, 5],
        ];

        foreach ($courses as $course) {
            if (isset($questions[$course->title])) {
                $courseQuestions = $questions[$course->title];

                foreach ($difficulties as $index => $difficulty) {
                    $difficultyName = $difficulty->value;

                    // Ensure questions exist for the difficulty level
                    if (isset($courseQuestions[$index])) {
                        $questionData = $courseQuestions[$index];

                        // Determine question detail type
                        $type = empty($questionData[2])
                            ? QuestionDetailType::IDENTIFICATION->value
                            : (is_array($questionData[1])
                                ? QuestionDetailType::MULTIPLE_CHOICE_MANY->value
                                : QuestionDetailType::MULTIPLE_CHOICE_SINGLE->value);

                        // Insert question details
                        $question_detail_id = DB::table('question_details')->insertGetId([
                            'type' => $type,
                            'answer' => json_encode($questionData[1]),
                            'choices' => !empty($questionData[2]) ? json_encode($questionData[2]) : null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        // Generate difficulty value within the specified range
                        $difficultyRange = $difficultyRanges[$difficultyName];
                        $difficultyValue = mt_rand($difficultyRange[0] * 10, $difficultyRange[1] * 10) / 10;

                        // Generate discrimination index (0.5 to 2.0)
                        $discriminationIndex = mt_rand(50, 200) / 100;

                        // Insert question
                        DB::table('questions')->insert([
                            'course_id' => $course->course_id,
                            'question_detail_id' => $question_detail_id,
                            'difficulty_type' => $difficultyName,
                            'test_type' => TestType::PRETEST->value,
                            'question' => $questionData[0],
                            'discrimination_index' => $discriminationIndex,
                            'difficulty_value' => $difficultyValue,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}
