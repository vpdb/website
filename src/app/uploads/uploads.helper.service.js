export default class UploadHelper {

	addIcons(entity) {
		const m = entity.moderation;
		if (m.is_approved && m.auto_approved) {
			entity.icon = 'thumb-up-auto';

		} else if (m.is_approved) {
			entity.icon = 'thumb-up';

		} else if (m.is_refused) {
			entity.icon = 'thumb-down';

		} else {
			entity.icon = 'thumbs-up-down';
		}
	}

	mapHistory(item) {
		const h = {
			message: item.message,
			created_at: new Date(item.created_at),
			created_by: item.created_by
		};
		switch (item.event) {
			case 'approved':
				h.status = 'Approved';
				h.icon = 'thumb-up';
				break;
			case 'refused':
				h.status = 'Refused';
				h.icon = 'thumb-down';
				break;
			case 'pending':
				h.status = 'Set to Pending';
				h.icon = 'thumbs-up-down';
				break;
		}
		return h;
	}
}