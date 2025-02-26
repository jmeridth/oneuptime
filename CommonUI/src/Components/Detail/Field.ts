import Route from 'Common/Types/API/Route';
import URL from 'Common/Types/API/URL';
import { JSONObject } from 'Common/Types/JSON';
import { ReactElement } from 'react';
import AlignItem from '../../Types/AlignItem';
import FieldType from '../Types/FieldType';

export default interface Field {
    title?: string;
    description?: string;
    key: string;
    fieldType?: FieldType;
    colSpan?: number | undefined;
    alignItem?: AlignItem | undefined;
    contentClassName?: string | undefined;
    getElement?:
        | ((
              item: JSONObject,
              miscProps?: JSONObject | undefined,
              callback?: Function | undefined
          ) => ReactElement)
        | undefined;
    sideLink?: {
        text: string;
        url: Route | URL;
        openLinkInNewTab?: boolean;
    };
    placeholder?: string;
    opts?:
        | {
              isCopyable?: boolean | undefined;
          }
        | undefined;
}
