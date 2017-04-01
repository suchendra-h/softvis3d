import Metric from "./Metric";
import Scale from "./Scale";
import Layout from "./Layout";
import {district} from "../constants/Layouts";
import {noColorMetric, noMetricId} from "../constants/Metrics";
import {LOGARITHMIC} from "../constants/Scales";
import {observable} from "mobx";

export default class VisualizationOptions {

    public static createDefault(): VisualizationOptions {
        let defaultMetric = new Metric(noMetricId, "NONE", " -- None -- ", "");
        return new VisualizationOptions(district, defaultMetric, defaultMetric, noColorMetric, LOGARITHMIC);
    }

    public layout: Layout;
    public footprint: Metric;
    public height: Metric;
    @observable
    public metricColor: Metric;
    public scale: Scale;

    constructor(layout: Layout, footprint: Metric, height: Metric, metricColor: Metric, scale: Scale) {
        this.layout = layout;
        this.footprint = footprint;
        this.height = height;
        this.metricColor = metricColor;
        this.scale = scale;
    }

}
