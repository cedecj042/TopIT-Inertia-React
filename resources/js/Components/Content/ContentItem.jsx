import { replaceSemicolonsWithCommas } from '@/Library/utils';
import React from 'react';

export default function ContentItem({ item }) {
    switch (item.type.toLowerCase()) {
        case 'text':
            return <p className='m-0'>{replaceSemicolonsWithCommas(item.text)}</p>;

        case 'table':
            return (
                <div className="table my-3">
                    <p className="table-title">{item.content.caption}</p>
                    {item.content.images && item.content.images.length > 0 ? (
                        <div className="table-images">
                            {item.content.images.map((image, index) => (
                                <img key={index} src={image.file_path} alt="Table Image" className="img-fluid" />
                            ))}
                        </div>
                    ) : (
                        <p>No images available for this table.</p>
                    )}
                </div>
            );

        case 'figure':
            return (
                <div className="figure my-3">
                    <p className="figure-title">{item.content.caption}</p>
                    <div className="figure-images">
                        {item.content.images.map((image, index) => (
                            <img key={index} src={image.file_path} alt="Figure Image" className="img-fluid" />
                        ))}
                    </div>
                </div>
            );

        case 'code':
            return (
                <div className="code my-3">
                    <p className="code-title">{item.content.caption}</p>
                    <div className="code-images">
                        {item.content.images.map((image, index) => (
                            <img key={index} src={image.file_path} alt="Code Image" className="img-fluid" />
                        ))}
                    </div>
                </div>
            );

        default:
            return null;
    }
}
