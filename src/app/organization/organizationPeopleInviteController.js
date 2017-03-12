﻿angular
    .module('bit.organization')

    .controller('organizationPeopleInviteController', function ($scope, $state, $uibModalInstance, apiService, cipherService) {
        $scope.loading = true;
        $scope.selectedSubvaults = [];
        $scope.selectedSubvaultsReadOnly = [];

        $uibModalInstance.opened.then(function () {
            apiService.subvaults.listOrganization({ orgId: $state.params.orgId }, function (list) {
                $scope.subvaults = cipherService.decryptSubvaults(list.Data, $state.params.orgId, true);
                $scope.loading = false;
            });
        });

        $scope.toggleSubvaultSelectionAll = function ($event) {
            var subvaultIds = [];
            if ($event.target.checked)
            {
                for (var i = 0; i < $scope.subvaults.length; i++) {
                    subvaultIds.push($scope.subvaults[i].id);
                }
            }
            else {
                $scope.selectedSubvaultsReadOnly = [];
            }

            $scope.selectedSubvaults = subvaultIds;
        };

        $scope.toggleSubvaultSelection = function (id) {
            var i = $scope.selectedSubvaults.indexOf(id);
            if (i > -1) {
                $scope.selectedSubvaults.splice(i, 1);

                var j = $scope.selectedSubvaultsReadOnly.indexOf(id);
                if (j > -1) {
                    $scope.selectedSubvaultsReadOnly.splice(j, 1);
                }
            }
            else {
                $scope.selectedSubvaults.push(id);
            }
        };

        $scope.toggleSubvaultReadOnlySelection = function (id) {
            var i = $scope.selectedSubvaultsReadOnly.indexOf(id);
            if (i > -1) {
                $scope.selectedSubvaultsReadOnly.splice(i, 1);
            }
            else {
                $scope.selectedSubvaultsReadOnly.push(id);
            }
        };

        $scope.submit = function (model) {
            var subvaults = [];
            for (var i = 0; i < $scope.selectedSubvaults.length; i++) {
                subvaults.push({
                    subvaultId: $scope.selectedSubvaults[i],
                    readOnly: $scope.selectedSubvaultsReadOnly.indexOf($scope.selectedSubvaults[i]) > -1
                });
            }

            apiService.organizationUsers.invite({ orgId: $state.params.orgId }, {
                email: model.email,
                subvaults: subvaults
            }, function () {
                $uibModalInstance.close();
            });
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });