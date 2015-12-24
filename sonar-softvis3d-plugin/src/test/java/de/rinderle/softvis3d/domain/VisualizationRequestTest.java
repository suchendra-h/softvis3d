/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2015 Stefan Rinderle
 * stefan@rinderle.info
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
package de.rinderle.softvis3d.domain;

import de.rinderle.softvis3d.base.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.sonar.ScmInfoType;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

/**
 * Wrapper class for a visualization request.
 */
public class VisualizationRequestTest {

  @Test
  public void testHashCode() throws Exception {
    VisualizationRequest request1 = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20, ScmInfoType.NONE);
    VisualizationRequest request2 = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20, ScmInfoType.NONE);

    assertEquals(request1.hashCode(), request2.hashCode());

    request1 = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20, ScmInfoType.NONE);
    request2 = new VisualizationRequest(2, LayoutViewType.CITY, 1, 20, ScmInfoType.NONE);

    assertNotEquals(request1.hashCode(), request2.hashCode());
  }
}
