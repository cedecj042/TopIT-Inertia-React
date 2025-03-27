import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRequest } from "@/Library/hooks";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";
import QuestionForm from "@/Components/Pretest/QuestionForm";
import Modal from "@/Components/Modal/Modal";
import { toast } from "sonner";

const Test = ({ test_item, item_count }) => {

    const testItem = test_item.data;
    const { isProcessing, putRequest } = useRequest();
    const { data, watch, reset, register, formState: { errors },setError, setValue, getValues, handleSubmit } = useForm({
        defaultValues: {
            assessment_id: testItem.assessment.assessment_id,
            assessment_item_id: testItem.assessment_item_id,
            participants_answer: []
        }
    });

    useEffect(() => {
        if (testItem) {
            reset({
                assessment_id: testItem.assessment.assessment_id,
                assessment_item_id: testItem.assessment_item_id,
                participants_answer: []
            });
        }
    }, [testItem, reset]);

    const onSubmit = () => {
        const formData = getValues();
        putRequest('test.submit', testItem.assessment_item_id, formData, {
            onSuccess:() =>{
                reset();
            },
            onError: (error)=>{
                toast.error(error, {duration:300});
            }
        });
    };

    return (
        <>
            <Navbar isLight={true} />
            <div className="min-vh-100 d-flex align-items-center">
                <div className="container mb-6">
                    <div className="row justify-content-center">
                        <div className="col-9">
                            <h1 className="h4 mb-2">{testItem.course.title}</h1>
                            <p className="text-muted small mb-4">
                                {testItem.assessment.updated_at}{" "}
                                <span className="ms-2">
                                    {testItem.assessment.start_time}
                                </span>
                            </p>
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
                                        Next
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

Test.layout = (page) => <MainLayout children={page} />;
export default Test;
