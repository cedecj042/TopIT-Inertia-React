<?php

namespace Database\Seeders;

use App\Enums\QuestionDetailType;
use App\Enums\TestType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PretestQuestionSeeder extends Seeder
{
    public function run()
    {
        // Fetch all courses and difficulty levels
        $courses = DB::table('courses')->get();
        $difficulties = DB::table('difficulty')->get()->keyBy('name');

        $pretestQuestions = [
            'Software Development' => [
                ['What is a class in OOP?', 'A blueprint for objects.', []], // Identification
                ['What does "Agile" mean in software development?', 'Iterative development', ['Iterative development', 'Waterfall model', 'Code design', 'Database design']], // MC Single
                ['Which of the following are Agile practices?', ['Scrum', 'Kanban'], ['Scrum', 'Kanban', 'Version control', 'Waterfall']], // MC Many
                ['What is version control?', 'Managing code changes', ['Managing code changes', 'Testing code', 'Analyzing requirements', 'Deploying software']], // MC Single
                ['Which tools are used for version control?', ['Git', 'SVN'], ['Git', 'SVN', 'Excel', 'Photoshop']], // MC Many
            ],
            'Understanding and Using Data' => [
                ['What is SQL?', 'A database query language.', []], // Identification
                ['What is the primary role of a database?', 'To store data', ['To store data', 'To analyze data', 'To visualize data', 'To back up files']], // MC Single
                ['Which are common databases?', ['MySQL', 'PostgreSQL'], ['MySQL', 'PostgreSQL', 'Excel', 'Notepad']], // MC Many
                ['What does ETL stand for?', 'Extract, Transform, Load', ['Extract, Transform, Load', 'Encode, Transfer, Launch', 'Examine, Tally, List', 'Edit, Test, Learn']], // MC Single
                ['What are steps in data analysis?', ['Data collection', 'Data cleaning'], ['Data collection', 'Data cleaning', 'Algorithm writing', 'System design']], // MC Many
            ],
            'Overview of System Architecture' => [
                ['What does CPU stand for?', 'Central Processing Unit', []], // Identification
                ['What is a client-server architecture?', 'A network model with clients and servers.', ['A network model with clients and servers', 'An operating system model', 'A programming paradigm', 'A database structure']], // MC Single
                ['Which are types of system architecture?', ['Client-server', 'Peer-to-peer'], ['Client-server', 'Peer-to-peer', 'Distributed', 'Monolithic']], // MC Many
                ['What does a system bus do?', 'Transfers data between components.', ['Transfers data between components.', 'Stores programs', 'Executes instructions', 'Monitors power usage']], // MC Single
                ['Which are parts of a system architecture?', ['Processor', 'Memory'], ['Processor', 'Memory', 'Mouse', 'Monitor']], // MC Many
            ],
            'Understanding Information Security' => [
                ['What is encryption?', 'A method to secure data.', []], // Identification
                ['What is a firewall?', 'A tool to monitor and control network traffic.', ['A tool to monitor and control network traffic', 'A database backup tool', 'A network cable', 'A power surge protector']], // MC Single
                ['Which are information security threats?', ['Phishing', 'Ransomware'], ['Phishing', 'Ransomware', 'Firewall', 'Ethernet']], // MC Many
                ['What is multi-factor authentication?', 'Using multiple methods to verify identity.', ['Using multiple methods to verify identity.', 'Encrypting passwords', 'Storing passwords securely', 'Tracking logins']], // MC Single
                ['Which techniques improve security?', ['Encryption', 'Access control'], ['Encryption', 'Access control', 'Data duplication', 'Physical backups']], // MC Many
            ],
            'Understanding the IT Business and Ethics' => [
                ['What is business ethics?', 'Moral principles for business conduct.', []], // Identification
                ['What is corporate social responsibility (CSR)?', 'Managing a business to positively impact society.', ['Managing a business to positively impact society', 'A system for storing customer data', 'A tax management tool', 'A software licensing agreement']], // MC Single
                ['Which are IT ethical principles?', ['Confidentiality', 'Integrity'], ['Confidentiality', 'Integrity', 'Profitability', 'Growth']], // MC Many
                ['What is data privacy?', 'Protecting personal information from misuse.', ['Protecting personal information from misuse.', 'Securing hardware.', 'Backing up software.', 'Encrypting files.']], // MC Single
                ['Which are ethical IT issues?', ['Data misuse', 'Unlicensed software'], ['Data misuse', 'Unlicensed software', 'Slow networks', 'Large files']], // MC Many
            ],
            'Project Management & Technical Communication' => [
                ['What is project management?', 'Managing tasks to achieve a goal.', []], // Identification
                ['What is a Gantt chart used for?', 'Tracking project schedules.', ['Tracking project schedules.', 'Analyzing data trends.', 'Storing project files.', 'Organizing team members.']], // MC Single
                ['Which are project management methodologies?', ['Agile', 'Waterfall'], ['Agile', 'Waterfall', 'Critical Path', 'PERT']], // MC Many
                ['What is the role of a project manager?', 'To oversee project progress.', ['To oversee project progress.', 'To write code.', 'To manage servers.', 'To design systems.']], // MC Single
                ['Which are technical communication tools?', ['Presentations', 'Reports'], ['Presentations', 'Reports', 'Emails', 'Whiteboards']], // MC Many
            ]
        ];

        // Loop over each course
        foreach ($courses as $course) {
            if (isset($pretestQuestions[$course->title])) {
                $courseQuestions = $pretestQuestions[$course->title];

                foreach (['Very Easy', 'Easy', 'Average', 'Hard', 'Very Hard'] as $index => $difficultyName) {
                    $questionData = $courseQuestions[$index];

                    // Determine question detail type based on data structure
                    $type = empty($questionData[2])
                        ? QuestionDetailType::IDENTIFICATION->value
                        : (is_array($questionData[1])
                            ? QuestionDetailType::MULTIPLE_CHOICE_MANY->value
                            : QuestionDetailType::MULTIPLE_CHOICE_SINGLE->value);

                    $difficulty_id = $difficulties[$difficultyName]->difficulty_id;

                    // Insert question details
                    $question_detail_id = DB::table('question_details')->insertGetId([
                        'type' => $type,
                        'answer' => json_encode($questionData[1]),
                        'choices' => !empty($questionData[2]) ? json_encode($questionData[2]) : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // Insert question with `Pretest` as test type
                    DB::table('questions')->insert([
                        'course_id' => $course->course_id,
                        'question_detail_id' => $question_detail_id,
                        'difficulty_id' => $difficulty_id,
                        'test_type' => TestType::PRETEST->value,
                        'question' => $questionData[0],
                        'discrimination_index' => rand(-1, 1),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
