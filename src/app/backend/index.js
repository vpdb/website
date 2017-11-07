import angular from 'angular';
import ApiHelper from './apihelper.service';
import DownloadService from './download.service';
import { GameResource, GameRatingResource, GameStarResource, GameRequestResource, GameReleaseNameResource } from './game.resource';
import { FileResource, FileBlockmatchResource } from './file.resource';
import { ReleaseResource, ReleaseCommentResource, ReleaseVersionResource, ReleaseFileValidationResource,
	ReleaseModerationCommentResource, ReleaseModerationResource, ReleaseRatingResource, ReleaseStarResource} from './release.resource';
import { RomResource } from './rom.resource';
import { AuthResource, AuthRedirectResource, ProfileResource, TokenResource } from './auth.resource';
import { UserResource, UserConfirmationResource, UserStarResource } from './user.resource';
import { TagResource } from './tag.resource';
import { BuildResource } from './build.resource';
import { RolesResource } from './roles.resource';
import { PlanResource } from './plan.resource';
import { BackglassResource, BackglassModerationResource } from './backglass.resource';
import { IpdbResource } from './ipdb.resource';

export default angular
	.module('vpdb.backend', [])
	.service('ApiHelper', ApiHelper)
	.service('AuthResource', AuthResource)
	.service('AuthRedirectResource', AuthRedirectResource)
	.service('BackglassResource', BackglassResource)
	.service('BackglassModerationResource', BackglassModerationResource)
	.service('BuildResource', BuildResource)
	.service('DownloadService', DownloadService)
	.service('FileResource', FileResource)
	.service('FileBlockmatchResource', FileBlockmatchResource)
	.service('GameRatingResource', GameRatingResource)
	.service('GameReleaseNameResource', GameReleaseNameResource)
	.service('GameRequestResource', GameRequestResource)
	.service('GameResource', GameResource)
	.service('GameStarResource', GameStarResource)
	.service('IpdbResource', IpdbResource)
	.service('PlanResource', PlanResource)
 	.service('ProfileResource', ProfileResource)
 	.service('ReleaseResource', ReleaseResource)
 	.service('ReleaseCommentResource', ReleaseCommentResource)
 	.service('ReleaseVersionResource', ReleaseVersionResource)
 	.service('ReleaseFileValidationResource', ReleaseFileValidationResource)
 	.service('ReleaseModerationCommentResource', ReleaseModerationCommentResource)
 	.service('ReleaseModerationResource', ReleaseModerationResource)
 	.service('ReleaseRatingResource', ReleaseRatingResource)
 	.service('ReleaseStarResource', ReleaseStarResource)
 	.service('RolesResource', RolesResource)
 	.service('RomResource', RomResource)
 	.service('TagResource', TagResource)
 	.service('TokenResource', TokenResource)
 	.service('UserResource', UserResource)
 	.service('UserConfirmationResource', UserConfirmationResource)
 	.service('UserStarResource', UserStarResource)
	.name;