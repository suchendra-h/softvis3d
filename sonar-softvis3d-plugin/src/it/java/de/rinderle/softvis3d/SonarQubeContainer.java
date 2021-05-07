package de.rinderle.softvis3d; /**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */

import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.output.OutputFrame;
import org.testcontainers.containers.wait.strategy.HttpWaitStrategy;
import org.testcontainers.images.builder.ImageFromDockerfile;
import org.testcontainers.utility.MountableFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Duration;
import java.util.function.Consumer;

import static org.junit.Assert.fail;

public class SonarQubeContainer extends GenericContainer<SonarQubeContainer> {

    public SonarQubeContainer(String sonarQubeVersion, Network network, Consumer<OutputFrame> logConsumer) {
        super(getImageFromDockerfile(sonarQubeVersion));

        this.withEnv("SONAR_ES_BOOTSTRAP_CHECKS_DISABLE", "true");

        this.withNetwork(network);
        this.withNetworkAliases("sq_server");

        this.waitStrategy = new HttpWaitStrategy()
                .forPath("/api/system/status")
                .forResponsePredicate(response -> response.contains("\"status\":\"UP\""))
                .withStartupTimeout(Duration.ofSeconds(300));
        this.withExposedPorts(9000);
        this.withCopyFileToContainer(MountableFile.forHostPath("./target/sonar-softvis3d-plugin-1.2.1-SNAPSHOT.jar"), "/opt/sonarqube/extensions/plugins/softvis3d-sonar-plugin.jar");

        this.withReuse(true);

        this.withLogConsumer(logConsumer);
    }

    private static ImageFromDockerfile getImageFromDockerfile(String sonarQubeVersion) {
        File dockerfile = new File("target/test-classes/sonarqube/Dockerfile");
        replaceVersion(dockerfile, sonarQubeVersion);
        return new ImageFromDockerfile("sonarqube-container", false)
                .withFileFromFile("Dockerfile", dockerfile);
    }

    private static void replaceVersion(File dockerFile, String sonarQubeVersion) {
        try {
            Charset charset = StandardCharsets.UTF_8;
            String content = new String(Files.readAllBytes(dockerFile.toPath()), charset);
            content = content.replaceAll("XX_SONARQUBE_VERSION_XX", sonarQubeVersion);
            Files.write(dockerFile.toPath(), content.getBytes(charset));
        } catch (IOException e) {
            fail(e.getMessage());
        }
    }

}
