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

import axios, { AxiosBasicCredentials, AxiosPromise, AxiosRequestConfig } from "axios";
import { lazyInject } from "../../inversify.config";
import ComponentStatusStore from "../../stores/ComponentStatusStore";

// const config: AxiosRequestConfig = {
//     method: "get",
//     withCredentials: false,
//     params: {
//         component: "org.apache.maven:maven",
//     },
//     headers: {
//         Authorization: "Basic ZGIwMzdlN2FlNzExYmI5NTZmNGZkYWNjMzBmOGVhZDUxODgxZTA1Yjo=",
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Access-Control-Allow-Origin": "*",
//     },
// };

export abstract class BackendService {
    @lazyInject("ComponentStatusStore")
    protected readonly componentStatusStore!: ComponentStatusStore;

    public callApi(route: string, options: AxiosRequestConfig = {}): AxiosPromise {
        const auth: AxiosBasicCredentials = {
            username: "ZGIwMzdlN2FlNzExYmI5NTZmNGZkYWNjMzBmOGVhZDUxODgxZTA1Yjo=",
            password: "",
        };
        options.auth = auth;
        options.headers = {
            Authorization: "Basic ZGIwMzdlN2FlNzExYmI5NTZmNGZkYWNjMzBmOGVhZDUxODgxZTA1Yjo=",
        };
        console.log(options);
        return axios.get(this.getApiUrl() + route, options);
    }

    private getApiUrl(): string {
        return (this.componentStatusStore.appConfiguration.baseUrl || "") + "/api";
    }
}
