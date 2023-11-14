import './RichTextEditor.css';
import React, {useState, useRef} from "react";
import {Editor} from "@tinymce/tinymce-react";

function RichTextEditor({initialValue, onChange}) {

    const editorRef = useRef(null);

    const [explanation, setExplanation] = useState(initialValue ? initialValue : '');

    function onChangeEditor(event, editor) {
        let content = editor.getContent();
        setExplanation(content);
    }

    function onBlurEditor(event, editor) {
        if (onChange) {
            onChange(editor.getContent());
        }
    }

    return (
        <div className={"rich-text-editor"}>
            <Editor
                tinymceScriptSrc={"/vendor/tinymce/tinymce.min.js"}
                onInit={(event, editor) => editorRef.current = editor}
                onChange={onChangeEditor}
                onBlur={onBlurEditor}
                initialValue={initialValue}
                init={{
                    height: 300,
                    menubar: false,
                    auto_focus: true,
                    language: 'ru',
                    block_formats: 'Обычный текст=p;Большой заголовок=h1;Средний заголовок=h2;Маленький заголовок=h3',
                    plugins: [
                        'link', 'lists'
                    ],
                    toolbar: 'blocks | bold italic underline | bullist numlist outdent indent | link | ' +
                        'alignleft aligncenter alignright alignjustify removeformat',
                    content_style: 'body { font-family: Segoe UI,Arial,sans-serif; font-size: 16px; }'
                }}
            />
        </div>
    );
}

export default RichTextEditor;