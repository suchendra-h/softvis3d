import * as React from "react";
import SelectOption from "./SelectOption";
import SelectGroup from "./SelectGroup";
import {ChangeEvent, MouseEventHandler} from "react";

type LocalChangeEvent = (value: any) => void|boolean;

interface SelectBoxProps {
    prepend?: JSX.Element[];
    append?: JSX.Element[];

    className?: string;
    disabled?: boolean;
    value: SelectOptionValue;
    label?: string;

    onChange: LocalChangeEvent;
    onClick?: MouseEventHandler<HTMLElement>;
    onMouseDown?: MouseEventHandler<HTMLElement>;
}

interface ValueStore {
    [index: string]: SelectOptionValue;
}

export default class SelectBox extends React.Component<SelectBoxProps, any> {

    //noinspection JSUnusedGlobalSymbols
    public static defaultProps = {
        prepend: [],
        append: [],
        className: "",
        disabled: false,
        value: null
    };

    private values: ValueStore = {};

    public handleChange(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;

        if (value in this.values) {
            this.props.onChange(this.values[value]);
        }
    }

    public render() {
        const noEvent = () => {
            // do nothing.
        };
        const clickEvent: MouseEventHandler<HTMLElement> = this.props.onClick || noEvent;
        const mouseDownEvent = this.props.onMouseDown || noEvent;
        const className = "selectbox " + (this.props.className || "");

        return (
            <div className={className.trim()}>
                {this.props.prepend}
                {this.renderLabel()}
                <select
                    disabled={this.props.disabled}
                    className={this.props.className}
                    value={this.props.value.id}
                    onChange={this.handleChange.bind(this)}
                    onClick={clickEvent}
                    onMouseDown={mouseDownEvent}
                >
                    {this.renderChildren()}
                </select>
                {this.props.append}
            </div>
        );
    }

    private renderLabel() {
        if (!this.props.label) {
            return null;
        }

        return (
            <span>{this.props.label}</span>
        );
    }

    private addValue(v: SelectOptionValue) {
        this.values[v.id] = v;
    }

    private clearValues() {
        this.values = {};
    }

    private renderChildren(): Array<React.Component<any, any>> {
        this.clearValues();
        const ref = (o: SelectOption | null) => {
            if (!o) {
                this.clearValues();
            } else {
                const v: SelectOptionValue = o.props.value;
                this.addValue(v);
            }
        };

        return React.Children.map<any>(
            (this.props.children as Array<SelectOption|SelectGroup>),
            (child: React.ReactChild) => {
                if (typeof child === "object" && child.type === SelectOption) {
                    return React.cloneElement(child, {
                        selected: child.props.value === this.props.value,
                        disabled: this.props.disabled || child.props.disabled,
                        ref
                    });
                }

                if (typeof child === "object" && child.type === SelectGroup) {
                    return React.cloneElement(child, {
                        selectedValue: this.props.value,
                        disabled: this.props.disabled || child.props.disabled,
                        optionRef: ref
                    });
                }

                return child;
            }
        );
    }
}