/*
 * softvis3d-webservice-example
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
package de.rinderle.softvis3d.neo;

import com.google.gson.Gson;
import de.rinderle.softvis3d.neoresult.Neo4jAnswer;

/**
 * Created by stefanrinderle on 15.12.15.
 */
public class Neo4jParser {

  public Neo4jAnswer parseNeoJson(final String neoJson) {
    Gson gson = new Gson();
    return gson.fromJson(neoJson, Neo4jAnswer.class);
  }
}
