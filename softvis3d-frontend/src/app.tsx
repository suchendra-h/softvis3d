///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppConfiguration } from "./classes/AppConfiguration";
import ErrorAction from "./classes/status/ErrorAction";
import { Wrangler } from "./components/scene/visualization/objects/Wrangler";
import Softvis3D from "./components/Softvis3D";
import { bindToInjection, container } from "./inversify.config";
import AppReactions from "./reactions/AppReactions";
import BuilderReactions from "./reactions/BuilderReactions";
import SceneReactions from "./reactions/SceneReactions";
import AutoReloadService from "./services/AutoReloadService";
import ClipBoardService from "./services/ClipBoardService";
import { HtmlDomService } from "./services/HtmlDomService";
import CityLayoutService from "./services/layout/CityLayoutService";
import SelectedElementService from "./services/SelectedElementService";
import SonarQubeMeasuresApiService from "./services/sonarqube/measures/api/SonarQubeMeasuresApiService";
import SonarQubeMeasuresTreeService from "./services/sonarqube/measures/api/SonarQubeMeasuresTreeService";
import SonarQubeTransformerService from "./services/sonarqube/measures/api/SonarQubeTransformerService";
import SonarQubeMeasuresMetricService from "./services/sonarqube/measures/SonarQubeMeasuresMetricService";
import SonarQubeMeasuresService from "./services/sonarqube/measures/SonarQubeMeasuresService";
import SonarQubeFilterStructureService from "./services/sonarqube/measures/structure/SonarQubeFilterStructureService";
import SonarQubeOptimizeStructureService from "./services/sonarqube/measures/structure/SonarQubeOptimizeStructureService";
import ScmAuthorsCalculatorService from "./services/sonarqube/scm/ScmAuthorsCalculatorService";
import ScmCommitsCalculatorService from "./services/sonarqube/scm/ScmCommitsCalculatorService";
import SonarQubeScmService from "./services/sonarqube/scm/SonarQubeScmService";
import SonarQubeComponentInfoService from "./services/sonarqube/SonarQubeComponentInfoService";
import SonarQubeMetricsService from "./services/sonarqube/SonarQubeMetricsService";
import TreeService from "./services/TreeService";
import UrlParameterService from "./services/UrlParameterService";
import VisualizationLinkSerializationService from "./services/VisualizationLinkSerializationService";
import VisualizationLinkService from "./services/VisualizationLinkService";
import WebGLDetectorService from "./services/WebGLDetectorService";
import AppStatusStore from "./stores/AppStatusStore";
import CityBuilderStore from "./stores/CityBuilderStore";
import ComponentStatusStore from "./stores/ComponentStatusStore";
import SceneStore from "./stores/SceneStore";
import VisualizationOptionStore from "./stores/VisualizationOptionStore";

export default class App {
    private static readonly WEBGL_ERROR_KEY = "WEBGL_ERROR";

    private readonly communicator: SonarQubeMetricsService;
    private readonly visualizationLinkService: VisualizationLinkService;
    private readonly componentInfoService: SonarQubeComponentInfoService;
    private readonly webGLDetectorService: WebGLDetectorService;

    private readonly appStatusStore: AppStatusStore;
    private readonly componentStatusStore: ComponentStatusStore;

    public constructor(config: AppConfiguration) {
        this.componentStatusStore = new ComponentStatusStore(config);
        container
            .bind<ComponentStatusStore>("ComponentStatusStore")
            .toConstantValue(this.componentStatusStore);

        this.appStatusStore = new AppStatusStore();
        this.appStatusStore.showLoadingQueue = config.isDev;
        container.bind<AppStatusStore>("AppStatusStore").toConstantValue(this.appStatusStore);

        container
            .bind<VisualizationOptionStore>("VisualizationOptionStore")
            .toConstantValue(VisualizationOptionStore.createDefault());

        bindToInjection(CityBuilderStore);
        bindToInjection(SceneStore);
        bindToInjection(SelectedElementService);
        bindToInjection(ClipBoardService);

        this.visualizationLinkService = bindToInjection(VisualizationLinkService);

        bindToInjection(SonarQubeScmService);
        bindToInjection(ScmCommitsCalculatorService);
        bindToInjection(SonarQubeMeasuresApiService);
        bindToInjection(SonarQubeMeasuresMetricService);
        this.communicator = bindToInjection(SonarQubeMetricsService);
        bindToInjection(SonarQubeMeasuresService);
        this.componentInfoService = bindToInjection(SonarQubeComponentInfoService);

        this.webGLDetectorService = bindToInjection(WebGLDetectorService);
        bindToInjection(UrlParameterService);
        bindToInjection(SonarQubeOptimizeStructureService);
        bindToInjection(SonarQubeMeasuresTreeService);
        bindToInjection(HtmlDomService);
        bindToInjection(SonarQubeTransformerService);
        bindToInjection(ScmAuthorsCalculatorService);
        bindToInjection(CityLayoutService);
        bindToInjection(TreeService);
        bindToInjection(AutoReloadService);
        bindToInjection(SonarQubeFilterStructureService);
        bindToInjection(VisualizationLinkSerializationService);
        bindToInjection(Wrangler);

        const reactions = [new AppReactions(), new SceneReactions(), new BuilderReactions()];
        if (reactions.length === 0) {
            // only to use the variable.
        }
    }

    public run() {
        this.communicator.loadAvailableMetrics().then(() => {
            this.visualizationLinkService.process(document.location.search);
        });

        this.componentInfoService.loadComponentInfo();
        this.assertClientRequirementsAreMet();

        ReactDOM.render(<Softvis3D />, document.getElementById("app"));
    }

    public stop(target: string) {
        const element = document.getElementById(target);
        if (element) {
            ReactDOM.unmountComponentAtNode(element);
        } else {
            throw Error("Target element id " + target + "not found");
        }
    }

    private assertClientRequirementsAreMet() {
        if (!this.webGLDetectorService.isWebGLSupported()) {
            const error = this.webGLDetectorService.getWebGLErrorMessage();

            this.appStatusStore.error(
                new ErrorAction(
                    App.WEBGL_ERROR_KEY,
                    "WebGL is required. " + error,
                    "Reload page",
                    () => {
                        location.reload();
                    }
                )
            );
        }
    }
}
