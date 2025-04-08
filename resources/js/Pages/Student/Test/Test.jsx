import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRequest } from "@/Library/hooks";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import "../../../../css/student/students.css";
import "../../../../css/student/questionform.css";

import QuestionForm from "@/Components/Pretest/QuestionForm";
import Modal from "@/Components/Modal/Modal";
import { toast } from "sonner";

const Test = ({ test_item, item_count }) => {
    const testItem = test_item.data;
    const { isProcessing, putRequest } = useRequest();
    const {
        data,
        watch,
        reset,
        register,
        formState: { errors },
        setError,
        setValue,
        getValues,
        handleSubmit,
    } = useForm({
        defaultValues: {
            assessment_id: testItem.assessment.assessment_id,
            assessment_item_id: testItem.assessment_item_id,
            participants_answer: [],
        },
    });

    useEffect(() => {
        if (testItem) {
            reset({
                assessment_id: testItem.assessment.assessment_id,
                assessment_item_id: testItem.assessment_item_id,
                participants_answer: [],
            });
        }
    }, [testItem, reset]);

    const onSubmit = () => {
        const formData = getValues();
        putRequest("test.submit", testItem.assessment_item_id, formData, {
            onSuccess: () => {
                reset();
            },
            onError: (error) => {
                toast.error(error, { duration: 300 });
            },
        });
    };

    return (
        <>
            <Navbar isLight={true} />
            <div className="min-vh-100 d-flex align-items-center">
                <div className="container mb-6 justify-content-center col-md-7">
                    <div className="test-header mb-5 text-center">
                        <h1 className="h4 mb-2 fw-bold">
                            {testItem.course.title}
                        </h1>
                        <div className="d-flex justify-content-center gap-4">
                            <span className="text-muted">
                                <i className="bi bi-calendar me-2"></i>
                                {testItem.assessment.updated_at}
                            </span>
                            <span className="text-muted">
                                <i className="bi bi-clock me-2"></i>
                                {testItem.assessment.start_time}
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <QuestionForm
                            index={item_count}
                            item={testItem}
                            setValue={setValue}
                            register={register}
                            watch={watch}
                        />
                        <div className="text-end mt-5">
                            <button
                                type="submit"
                                className="btn btn-primary px-4 btn-hover-primary"
                                disabled={isProcessing}
                            >
                                Next Question
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

Test.layout = (page) => <MainLayout children={page} />;
export default Test;
