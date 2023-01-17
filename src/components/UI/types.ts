import type React from "react";
import {HTMLAttributes} from "react";

export type HTMLTagProps<Tag, HTMLAttr extends HTMLAttributes<Tag> = React.HTMLAttributes<Tag>> = React.DetailedHTMLProps<HTMLAttr, Tag>
